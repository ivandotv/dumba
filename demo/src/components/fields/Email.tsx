import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../../formStore'

const Email = observer(function Email() {
  const formStore = useForm()

  return (
    <FormControl>
      <TextField
        type="text"
        id="email"
        name="email"
        label="Email"
        disabled={formStore.isSubmitting}
        value={formStore.fields.email.value}
        onChange={formStore.fields.email.onChange}
        onBlur={formStore.fields.email.onChange}
        error={!!formStore.fields.email.errors.length}
        helperText={<DisplayErrors errors={formStore.fields.email.errors} />}
        autoComplete="off"
        variant="filled"
        size="small"
      />
    </FormControl>
  )
})

export default Email
