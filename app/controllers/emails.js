import Controller from '@ember/controller';
import { computed, set } from '@ember/object';
import { or, readOnly } from '@ember/object/computed';
import QueryParams from 'ember-parachute';
import { task, timeout } from 'ember-concurrency';
import {
  compose, sort, ascend, descend, prop, length,
  where, toLower, map, assoc, contains, filter,
  split, mean, or as ramdaOr, cond, equals, T,
  curry, complement, isNil
} from 'ramda';
import moment from 'moment';

const DEBOUNCE_MS = 150;
const SORT_OPTIONS = ['newest', 'oldest', 'longest', 'shortest'];

const isNotNil = complement(isNil);
const dateAsMs = compose((d) => moment(d).unix(), prop('date'));
const bodyLength = compose((s) => s.length, prop('body'));
const descDate = (arr) => sort(descend(dateAsMs), arr);
const ascDate =  (arr) => sort(ascend(dateAsMs), arr);
const descBodyLength = (arr) => sort(descend(bodyLength), arr);
const ascBodyLength = (arr) => sort(ascend(bodyLength), arr);
const sortEmails = (sort, emails) => {
  return cond([
    [equals('newest'), () => descDate(emails)],
    [equals('oldest'),  () => ascDate(emails)],
    [equals('longest'), () => descBodyLength(emails)],
    [equals('shortest'), () => ascBodyLength(emails)],
    [T, () => descDate(emails)]
  ])(sort);
};

let applySearch = (search, emails) =>{
  let pred = where({ searchText: contains(toLower(search)) });
  return filter(pred, emails);
}
let searchEmails = (search, emails) => {
  return cond([
    [isNotNil, (search) => applySearch(search, emails)],
    [isNil, () => emails]
  ])(search);
};

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
    return ramdaOr(compose(Math.round, mean, map(prop('wordCount')))(this.filteredEmails), 0);
  }),

  searchableSortableEmails: computed('allEmails.@each', function() {
    let createSearchable = (email) => {
      let searchText = toLower(`${prop('subject', email)} ${prop('body', email)}`);
      return assoc('searchText', searchText, email);
    };

    let createSortable = (email) => {
      let withCharCount = assoc('charCount', compose((e) => e.length, prop('body'))(email), email);
      return assoc('wordCount', compose(length, split(' '), prop('body'))(withCharCount), withCharCount);
    };

    return map(compose(createSortable, createSearchable), this.allEmails);
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
