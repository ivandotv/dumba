import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      padding: theme.spacing(2),
      overflow: 'hidden',
      maxWidth: '40ch',
      width: '100%'
    },
    title: {
      marginTop: 0
    },
    btnWrap: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  })
)
export default function FormExplanation() {
  const classes = useStyles()
  return (
    <Paper elevation={2} className={classes.wrap}>
      <h4 className={classes.title}>HTML forms made easy</h4>
      <p>
        Dumba.js is a library for managing HTML forms via Mobx. It weighs less
        than
        <strong>3Kb</strong> gzipped.
      </p>
      <p>
        It supports asynchronous validation, and fields that depend on other
        fields.
      </p>
      <p>Play with the demo, check out the source or check out the docs.</p>
    </Paper>
  )
}
