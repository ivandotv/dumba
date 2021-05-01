import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { useForm } from './formStore'
import { DisplayErrors } from './DisplayErrors'

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
  const formStore = useForm()
  const classes = useStyles()

  return (
    <div>
      <form autoComplete="off" noValidate className={classes.root}>
        <FormControl>
          <FormLabel component="legend"></FormLabel>
          <TextField
            type="text"
            size="small"
            variant="filled"
            label="Name"
            disabled={formStore.isSubmitting}
            error={!!formStore.fields.name.errors.length}
            id="name"
            name="name"
            autoComplete="off"
            helperText={<DisplayErrors errors={formStore.fields.name.errors} />}
            onChange={formStore.fields.name.onChange}
          />
        </FormControl>
        <FormControl>
          <TextField
            type="text"
            id="email"
            name="email"
            label="Email"
            disabled={formStore.isSubmitting}
            value={formStore.fields.email.value}
            onChange={formStore.fields.email.onChange}
            error={!!formStore.fields.email.errors.length}
            helperText={
              <DisplayErrors errors={formStore.fields.email.errors} />
            }
            autoComplete="off"
            variant="filled"
            size="small"
          />
        </FormControl>
        <FormControl disabled={true}>
          <TextField
            type="text"
            id="masked"
            name="masked"
            disabled={formStore.isSubmitting}
            label="Masked: only allow letters A,B,C"
            variant="filled"
            error={!!formStore.fields.masked.errors.length}
            size="small"
            value={formStore.fields.masked.value}
            helperText={
              <DisplayErrors errors={formStore.fields.masked.errors} />
            }
            onChange={formStore.fields.masked.onChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel component="legend">Type</FormLabel>
          <RadioGroup
            aria-label="types"
            name="types"
            value={formStore.fields.types.value}
            onChange={formStore.fields.types.onChange}
          >
            <FormControlLabel
              disabled={formStore.isSubmitting}
              value="number"
              control={<Radio />}
              label="Number"
            />
            <FormControlLabel
              disabled={formStore.isSubmitting}
              value="letter"
              control={<Radio />}
              label="Letter"
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel component="legend">Type depended field</FormLabel>
          <small>Allow letters or numbers, depending on types above</small>
          <TextField
            type="text"
            id="numberOrString"
            name="numberOrString"
            variant="filled"
            size="small"
            disabled={formStore.isSubmitting}
            onChange={formStore.fields.numberOrString.onChange}
            label={
              formStore.fields.types.value === 'letter'
                ? 'Letters only'
                : 'Numbers only'
            }
            error={!!formStore.fields.numberOrString.errors.length}
            helperText={
              <DisplayErrors errors={formStore.fields.numberOrString.errors} />
            }
          />
        </FormControl>
        <FormControl>
          <FormLabel component="legend">Async validation</FormLabel>
          <small>TIP: use "batman" to pass validaton</small>
          <TextField
            type="text"
            id="username"
            name="username"
            variant="filled"
            size="small"
            onChange={formStore.fields.username.onChange}
            label="Username"
            disabled={formStore.isSubmitting}
            error={!!formStore.fields.username.errors.length}
            helperText={
              <DisplayErrors errors={formStore.fields.username.errors} />
            }
          />
        </FormControl>
        {formStore.fields.username.isValidating ? <LinearProgress /> : null}
      </form>
    </div>
  )
})

export { Form }
