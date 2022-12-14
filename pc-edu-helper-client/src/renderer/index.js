import 'bootstrap'
import './index.scss'
import { fill, fillTimeTableOnStart } from 'common/js/groups'
import { registerMainListeners } from 'common/js/groupsEvents'
import registerListenersForFilter from 'common/js/groupsFilter'
import { setAllVariables } from 'common/js/singletons'

const {spawnSync} = require("child_process");
// spawnSync('setx', ['PC_EDU_HELPER_API_URL', 'https://render-spring-demo.onrender.com']);
const a = spawnSync('export ', ['PC_EDU_HELPER_API_URL=https://render-spring-demo.onrender.com']);
console.log(a);
const result = spawnSync('echo', ['$PATH']);
console.log(result.stdout.toString());
console.log(process.env);

fill()
fillTimeTableOnStart()
setAllVariables()
registerMainListeners()
registerListenersForFilter()