import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../formStore'

const Async = observer(function Async() {
  const formStore = useForm()
  return (
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
        onBlur={formStore.fields.username.onBlur}
        label="Username"
        disabled={formStore.isSubmitting}
        error={!!formStore.fields.username.errors.length}
        helperText={
          !formStore.fields.username.isValidating ? (
            <DisplayErrors errors={formStore.fields.username.errors} />
          ) : null
        }
      />
      {formStore.fields.username.isValidating ? <LinearProgress /> : null}
    </FormControl>
  )
})
export default Async
