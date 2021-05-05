import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import { observer } from 'mobx-react-lite'
import { useForm } from '../formStore'

const Types = observer(function Types() {
  const formStore = useForm()
  return (
    <FormControl>
      <FormLabel component="legend">Type</FormLabel>
      <RadioGroup
        aria-label="types"
        name="types"
        row={true}
        value={formStore.fields.typeOptions.types.value}
        onBlur={formStore.fields.typeOptions.types.validateAsync}
        onChange={formStore.fields.typeOptions.types.onChange}
      >
        <FormControlLabel
          disabled={formStore.isSubmitting}
          value="number"
          control={<Radio />}
          label="Number"
        />
        <FormControlLabel
          disabled={formStore.isSubmitting}
          value="letter"
          control={<Radio />}
          label="Letter"
        />
      </RadioGroup>
    </FormControl>
  )
})
export default Types
