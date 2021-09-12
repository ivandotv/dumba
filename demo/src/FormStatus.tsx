import { observer } from 'mobx-react-lite'
import { useForm } from './formStore'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      padding: theme.spacing(2),
      overflow: 'hidden'
    },
    title: {
      marginTop: 0
    },
    btnWrap: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  })
)
const FormStatus = observer(function FormStatus() {
  const formStore = useForm()

  const classes = useStyles()

  return (
    <Paper elevation={2} className={classes.wrap}>
      <h4 className={classes.title}>Form status</h4>
      <p>
        <small>All fields are valid initially.</small>
        <br />
        valid:<strong> {formStore.isValid.toString()}</strong>
      </p>
      <p>
        <small>
          All fields have their validation tests executed at least once.
        </small>
        <br />
        validated: <strong>{formStore.isValidated.toString()}</strong>
      </p>
      <p>
        <small>
          True when asynchronous validation is in progress on any field.
        </small>
        <br />
        validating: <strong>{formStore.isValidating.toString()}</strong>
      </p>
      <p>
        <small>True when form is submitting data.</small>
        <br />
        submitting: <strong>{formStore.isSubmitting.toString()}</strong>
      </p>
      <div>
        <pre>payload: {JSON.stringify(formStore.data, undefined, 2)}</pre>
      </div>

      <div className={classes.btnWrap}>
        <Button
          variant="contained"
          color="primary"
          disabled={false}
          onClick={formStore.reset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={formStore.resetToLastSaved}
          disabled={!formStore.lastSavedData}
        >
          Reset to last saved
        </Button>
      </div>
      <p>
        <small>Reset: reset to form original data.</small>
        <br />
        <small>
          Reset to last saved: Reset to last successfully saved data.
        </small>
      </p>
    </Paper>
  )
})

export default FormStatus
