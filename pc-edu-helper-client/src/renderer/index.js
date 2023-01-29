import 'bootstrap'
import './index.scss'
import 'common/js/hints'
import { fill, fillTimeTableOnStart } from 'common/js/groups'
import { registerMainListeners } from 'common/js/groupsEvents'
import registerListenersForFilter from 'common/js/groupsFilter'

fill()
fillTimeTableOnStart()
registerMainListeners()
registerListenersForFilter()