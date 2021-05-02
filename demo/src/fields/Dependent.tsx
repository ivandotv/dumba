import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../formStore'

const Dependent = observer(function Dependent() {
  const formStore = useForm()
  return (
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
  )
})
export default Dependent
