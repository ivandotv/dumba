import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import { observer } from 'mobx-react-lite'
import { DisplayErrors } from '../DisplayErrors'
import { useForm } from '../../formStore'
import { Typography } from '@material-ui/core'

const Dependent = observer(function Dependent() {
  const formStore = useForm()

  return (
    <FormControl>
      <Typography>
        <small>
          <span>Allow letters or numbers, depending on the value of the </span>
          <strong>type</strong> above.
        </small>
      </Typography>
      <TextField
        type="text"
        id="numberOrString"
        name="numberOrString"
        variant="filled"
        size="small"
        value={formStore.fields.typeOptions.numberOrString.value}
        disabled={
          formStore.isSubmitting ||
          formStore.fields.typeOptions.numberOrString.isDisabled
        }
        onChange={formStore.fields.typeOptions.numberOrString.onChange}
        onBlur={formStore.fields.typeOptions.numberOrString.onChange}
        label={
          formStore.fields.typeOptions.types.value === 'letter'
            ? 'Letters only'
            : formStore.fields.typeOptions.types.value === 'number'
            ? 'Numbers only'
            : 'Disabled'
        }
        error={
          //only if field has errors and it is not disabled
          !!formStore.fields.typeOptions.numberOrString.errors.length &&
          !formStore.fields.typeOptions.numberOrString.isDisabled
        }
        helperText={
          // show errors only if field is not disabled
          !formStore.fields.typeOptions.numberOrString.isDisabled ? (
            <DisplayErrors
              errors={formStore.fields.typeOptions.numberOrString.errors}
            />
          ) : null
        }
      />
    </FormControl>
  )
})
export default Dependent
