import Controller from '@ember/controller';
import { computed, set } from '@ember/object';
import { or, readOnly } from '@ember/object/computed';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';
import {
  compose, sort, ascend, descend, prop,
  where, toLower, map, assoc, contains, filter } from 'ramda';
import moment from 'moment';

const DEBOUNCE_MS = 150;

const QP = new QueryParams({
  direction: {
    defaultValue: 'asc',
    refresh: true
  },
  search: {
    defaultValue: '',
    refresh: true
  }
});

export default Controller.extend(QP, {
  allEmails: or('model.{currentTask,previousTask}.value'),
  isLoading: readOnly('model.currentTask.isRunning'),
  hasError: readOnly('model.currentTask.isError'),
  error: readOnly('model.currentTask.error'),

  searchableEmails: computed('allEmails.@each', function() {
    let createSearchable = (email) => {
      let searchText = toLower(`${prop('subject', email)} ${prop('body', email)}`);
      return assoc('searchText', searchText, email);
    };

    return map(createSearchable, this.allEmails);
  }),

  filteredEmails: computed('searchableEmails', 'search', 'direction', function() {
    let emails = this.searchableEmails;
    if (this.search) {
      let pred = where({ searchText: contains(toLower(this.search)) });
      emails = filter(pred, this.searchableEmails);
    }

    let toMs = (d) => moment(d).unix();
    let dateAsMs = compose(toMs, prop('date'));

    if (this.direction === 'desc') {
     emails = sort(descend(dateAsMs), emails);
    } else {
     emails = sort(ascend(dateAsMs), emails);
    }

    return emails;
  }),

  searchTask: task(function *(term) {
    yield timeout(DEBOUNCE_MS);
    set(this, 'search', term);
  }).restartable()
});
