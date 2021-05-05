import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FormPanel from './Form'
import FormStatus from './FormStatus'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      display: 'flex',
      justifyContent: 'center',
      '& > * ': {
        // backgroundColor: 'red'
        margin: theme.spacing(2)
      }
    }
  })
)

function App() {
  const classes = useStyles()
  return (
    <div className={classes.app}>
      <FormPanel></FormPanel>
      <FormStatus></FormStatus>
    </div>
  )
}

export default App
