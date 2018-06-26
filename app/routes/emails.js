import Route from '@ember/routing/route';
import fetch from 'fetch';
import { task } from 'ember-concurrency';
import config from 'monday-night/config/environment';

export default Route.extend({
  model() {
    let previousTask = this.getEmails.lastSuccessful;
    let currentTask = this.getEmails.perform();

    return { previousTask, currentTask };
  },

  getEmails: task(function *() {
    let r = yield fetch(config.emails);
    let { emails } = yield r.json();
    return emails;
  }).restartable().cancelOn('deactivate')
});
