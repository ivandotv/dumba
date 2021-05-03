import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../formStore'

const Masked = observer(function Masked() {
  const formStore = useForm()
  return (
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
        helperText={<DisplayErrors errors={formStore.fields.masked.errors} />}
        onChange={formStore.fields.masked.onChange}
        onBlur={formStore.fields.masked.validateAsync}
      />
    </FormControl>
  )
})
export default Masked
