import FormControl from '@material-ui/core/FormControl'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../formStore'

const Superhero = observer(function Superhero() {
  const formStore = useForm()
  return (
    <FormControl>
      {/* <FormLabel component="legend">Superhero</FormLabel> */}
      <small>Asynchronous validation</small>
      <small>TIP: use "batman" to pass validaton</small>
      <TextField
        type="text"
        id="superhero"
        name="superhero"
        variant="filled"
        size="small"
        onChange={formStore.fields.superhero.onChange}
        onBlur={() =>
          formStore.fields.superhero.isDirty
            ? null
            : formStore.fields.superhero.validate()
        }
        label="Superhero name"
        disabled={formStore.isSubmitting}
        error={!!formStore.fields.superhero.errors.length}
        value={formStore.fields.superhero.value}
        helperText={
          !formStore.fields.superhero.isValidating ? (
            <DisplayErrors errors={formStore.fields.superhero.errors} />
          ) : null
        }
      />
      {formStore.fields.superhero.isValidating ? <LinearProgress /> : null}
    </FormControl>
  )
})
export default Superhero
