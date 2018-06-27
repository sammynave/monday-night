import Controller from '@ember/controller';
import { computed, set } from '@ember/object';
import { or, readOnly } from '@ember/object/computed';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';
import {
  compose, prop, map,
  mean, or as ramdaOr, curry
} from 'ramda';
import {
  sortEmails,
  SORT_OPTIONS,
  createSortable
} from 'monday-night/utils/sort-utils';
import {
  createSearchable,
  searchEmails
} from 'monday-night/utils/search-utils';

const DEBOUNCE_MS = 150;

const QP = new QueryParams({
  sort: {
    defaultValue: 'newest',
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
  sortOptions: SORT_OPTIONS,
  averageWordCount: computed('filteredEmails', function() {
    let averageCount = compose(Math.round, mean, map(prop('wordCount')))(this.filteredEmails);
    return ramdaOr(averageCount, 0);
  }),

  searchableSortableEmails: computed('allEmails.@each', function() {
    let searchableSortable = compose(createSortable, createSearchable);
    return map(searchableSortable, this.allEmails);
  }),

  filteredEmails: computed('searchableSortableEmails', 'search', 'sort', function() {
    let searcher = curry(searchEmails)(this.search);
    let sorter = curry(sortEmails)(this.sort);

    return compose(sorter, searcher)(this.searchableSortableEmails);
  }),

  searchTask: task(function *(search) {
    yield timeout(DEBOUNCE_MS);
    set(this, 'search', search);
  }).restartable()
});
