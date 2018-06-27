import {
  prop, where, toLower,
  assoc, contains, filter,
  cond, isNil, complement
} from 'ramda';

const isNotNil = complement(isNil);
const applySearch = (search, emails) =>{
  let pred = where({ searchText: contains(toLower(search)) });
  return filter(pred, emails);
}

export const createSearchable = (email) => {
  let searchText = toLower(`${prop('subject', email)} ${prop('body', email)}`);
  return assoc('searchText', searchText, email);
};

export const searchEmails = (search, emails) => {
  return cond([
    [isNotNil, (search) => applySearch(search, emails)],
    [isNil, () => emails]
  ])(search);
};

