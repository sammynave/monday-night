import moment from 'moment';
import {
  compose, sort, ascend, descend, prop,
  cond, equals, T, assoc, split, length
} from 'ramda';

const dateAsMs = compose((d) => moment(d).unix(), prop('date'));
const bodyLength = compose((s) => s.length, prop('body'));
const descDate = (arr) => sort(descend(dateAsMs), arr);
const ascDate =  (arr) => sort(ascend(dateAsMs), arr);
const descBodyLength = (arr) => sort(descend(bodyLength), arr);
const ascBodyLength = (arr) => sort(ascend(bodyLength), arr);

export const SORT_OPTIONS = ['newest', 'oldest', 'longest', 'shortest'];
export const sortEmails = (sort, emails) => {
  return cond([
    [equals('newest'), () => descDate(emails)],
    [equals('oldest'),  () => ascDate(emails)],
    [equals('longest'), () => descBodyLength(emails)],
    [equals('shortest'), () => ascBodyLength(emails)],
    [T, () => descDate(emails)]
  ])(sort);
};

export const createSortable = (email) => {
  let withCharCount = assoc('charCount', compose((e) => e.length, prop('body'))(email), email);
  return assoc('wordCount', compose(length, split(' '), prop('body'))(withCharCount), withCharCount);
};
