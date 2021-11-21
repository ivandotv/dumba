import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useForm } from '../formStore'
import Async from './fields/Async'
import Dependent from './fields/Dependent'
import Email from './fields/Email'
import Masked from './fields/Masked'
import Types from './fields/Types'
import Username from './fields/Username'

const useStyles = makeStyles((theme) =>
  createStyles({
    wrap: {
      display: 'flex'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(2),
      '& > *': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        width: '100%'
      }
    }
  })
)

/**
 * Fake submit - mock submit async form action
 * @param _form
 * @returns
 */
function fakeSubmit(_form) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, 1500)
  })
}

const FormDemo = observer(function FormDemo() {
  const classes = useStyles()
  const formStore = useForm()

  const handleOnSubmit = useMemo(
    () => formStore.handleSubmit(fakeSubmit),
    [formStore]
  )

  return (
    <Paper elevation={2} className={classes.wrap}>
      <form
        onSubmit={handleOnSubmit}
        autoComplete="off"
        noValidate
        className={classes.form}
      >
        <Username />
        <Email />
        <Masked />
        <Types />
        <Dependent />
        <Async />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={
            formStore.isSubmitting ||
            formStore.isValidating ||
            !formStore.isValid ||
            !formStore.isValidated
          }
        >
          Submit
        </Button>
      </form>
    </Paper>
  )
})

export default FormDemo
