// Import your own modules
import ShadersOrSomething from './modules/ShadersOrSomething';
// Import css
import './style.css';
// Some module from npm
import * as _ from 'lodash';

export default class Main {
  constructor() {
    console.log('TTrackracer main class started');

    /**
     * Write some logic here
     */
    const wow = 1 + 1;
    if (wow === 2) console.log('Sick!');

    /**
     * Call some modules
     */
    const something = new ShadersOrSomething();

    _.range(5).forEach(i => console.log(i));
  }
}

new Main();
