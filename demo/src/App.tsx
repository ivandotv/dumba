import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FormDemo from './FormDemo'
import FormExplanation from './FormExplanation'
import FormStatus from './FormStatus'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      // marginTop: theme.spacing(2),
      '& > * ': {
        margin: theme.spacing(2)
      }
    }
  })
)

function App() {
  const classes = useStyles()
  return (
    <div className={classes.app}>
      <FormDemo />
      <FormStatus />
      <FormExplanation />
    </div>
  )
}

export default App
