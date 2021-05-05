import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../formStore'

const Name = observer(function Name() {
  const formStore = useForm()
  return (
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
        value={formStore.fields.name.value}
        helperText={<DisplayErrors errors={formStore.fields.name.errors} />}
        onBlur={formStore.fields.name.validateAsync}
        onChange={formStore.fields.name.onChange}
      />
    </FormControl>
  )
})
export default Name
