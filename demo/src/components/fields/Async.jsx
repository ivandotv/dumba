import FormControl from '@material-ui/core/FormControl'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../../formStore'
import { Typography } from '@material-ui/core'

const Async = observer(function Async() {
  const formStore = useForm()

  return (
    <FormControl>
      <Typography>
        <small>Asynchronous validation</small>
        <small>TIP: use "batman" to pass validaton</small>
      </Typography>
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
export default Async
