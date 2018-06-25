import Controller from '@ember/controller';
import { or, readOnly } from '@ember/object/computed';

export default Controller.extend({
  emails: or('model.{currentTask,previousTask}.value'),
  isLoading: readOnly('model.currentTask.isRunning'),
  hasError: readOnly('model.currentTask.isError'),
  error: readOnly('model.currentTask.error'),


});
