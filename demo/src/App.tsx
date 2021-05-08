import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FormDemo from './FormDemo'
import FormStatus from './FormStatus'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      '& > * ': {
        margin: theme.spacing(2)
      }
    }
  })
)

function App() {
  const classes = useStyles()
  return (
    <>
      <div className={classes.app}>
        <FormDemo />
        <FormStatus />
      </div>
    </>
  )
}

export default App
