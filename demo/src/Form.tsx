import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import Async from './fields/Async'
import Dependent from './fields/Dependent'
import Email from './fields/Email'
import Masked from './fields/Masked'
import Name from './fields/Name'
import Types from './fields/Types'
import Button from '@material-ui/core/Button'
import { useForm } from './formStore'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // maxWidth: '600px',
      // width: '600px',
      '& > *': {
        margin: theme.spacing(1),
        width: '40ch'
      }
    }
  })
)
const Form = observer(function Form() {
  const classes = useStyles()
  const formStore = useForm()

  console.log('all validated ', formStore.allValidated)
  console.log('all dirty ', formStore.allDirty)
  return (
    <div>
      <form autoComplete="off" noValidate className={classes.root}>
        <Name />
        <Email />
        <Masked />
        <Types />
        <Dependent />
        <Async />
        <Button
          variant="contained"
          color="primary"
          disabled={
            formStore.isSubmitting ||
            formStore.isValidating ||
            !formStore.isValid ||
            !formStore.allValidated
          }
        >
          Submit
        </Button>
      </form>
    </div>
  )
})

export { Form }
