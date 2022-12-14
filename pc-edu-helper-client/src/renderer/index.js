import 'bootstrap'
import './index.scss'
import { fill, fillTimeTableOnStart } from 'common/js/groups'
import { registerMainListeners } from 'common/js/groupsEvents'
import registerListenersForFilter from 'common/js/groupsFilter'
import { setAllVariables } from 'common/js/singletons'

fill()
fillTimeTableOnStart()
setAllVariables()
registerMainListeners()
registerListenersForFilter()