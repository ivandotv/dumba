import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../../formStore'

const Username = observer(function Username() {
  const formStore = useForm()

  return (
    <FormControl>
      <FormLabel component="legend"></FormLabel>
      <TextField
        type="text"
        size="small"
        variant="filled"
        label="Username"
        disabled={formStore.isSubmitting}
        error={!!formStore.fields.username.errors.length}
        id="username"
        name="username"
        autoComplete="off"
        value={formStore.fields.username.value}
        helperText={<DisplayErrors errors={formStore.fields.username.errors} />}
        onBlur={formStore.fields.username.onChange}
        onChange={formStore.fields.username.onChange}
      />
    </FormControl>
  )
})
export default Username
