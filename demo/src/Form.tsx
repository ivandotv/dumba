import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import type { Form } from 'dumba'
import { observer } from 'mobx-react-lite'
import Dependent from './fields/Dependent'
import Email from './fields/Email'
import Masked from './fields/Masked'
import Username from './fields/Username'
import Superhero from './fields/Superhero'
import Types from './fields/Types'
import { useForm } from './formStore'
import { schema } from './schema'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      display: 'flex',
      maxWidth: '45ch'
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

type SchemaValues<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends { value: any }
        ? T[key]['value' & keyof T[key]]
        : SchemaValues<T[key]>
    }
  : T

function fakeSubmit(
  payload: SchemaValues<typeof schema>,
  form: Form<typeof schema>
) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, 1500)
  })
}

const FormPanel = observer(function FormPanel() {
  const classes = useStyles()
  const formStore = useForm()

  return (
    <Paper elevation={2} className={classes.wrap}>
      <form autoComplete="off" noValidate className={classes.form}>
        <Username />
        <Email />
        <Masked />
        <Types />
        <Dependent />
        <Superhero />
        <Button
          variant="contained"
          color="primary"
          disabled={
            formStore.isSubmitting ||
            formStore.isValidating ||
            !formStore.isValid ||
            !formStore.isValidated
          }
          onClick={async () => {
            const r = await formStore.handleSubmit(fakeSubmit)
            console.log(r)
          }}
        >
          Submit
        </Button>
      </form>
    </Paper>
  )
})

export default FormPanel
