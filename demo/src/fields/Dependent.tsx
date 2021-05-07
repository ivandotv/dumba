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
      <FormLabel component="legend">Dependency field</FormLabel>
      <small>
        Allow letters or numbers, depending on the value of the{' '}
        <strong>type</strong> above.
      </small>
      <TextField
        type="text"
        id="numberOrString"
        name="numberOrString"
        variant="filled"
        size="small"
        value={formStore.fields.typeOptions.numberOrString.value}
        disabled={formStore.isSubmitting}
        onChange={formStore.fields.typeOptions.numberOrString.onChange}
        onBlur={formStore.fields.typeOptions.numberOrString.onChange}
        label={
          formStore.fields.typeOptions.types.value === 'letter'
            ? 'Letters only'
            : 'Numbers only'
        }
        error={!!formStore.fields.typeOptions.numberOrString.errors.length}
        helperText={
          <DisplayErrors
            errors={formStore.fields.typeOptions.numberOrString.errors}
          />
        }
      />
    </FormControl>
  )
})
export default Dependent
