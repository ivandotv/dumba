import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import FormDemo from 'components/FormDemo'
import FormStatus from 'components/FormStatus'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    app: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      '& > * ': {
        margin: theme.spacing(2)
      }
    },
    title: {
      textAlign: 'center'
    }
  })
)

export default function Index() {
  const classes = useStyles()

  return (
    <>
      <div className={classes.title}>
        <Typography variant="h4">Dumba Form Demo</Typography>
        <Typography>
          Checkout the documentation at <Link href="www.google.com">Dumba</Link>
        </Typography>
      </div>
      <div className={classes.app}>
        <FormDemo />
        <FormStatus />
      </div>
    </>
  )
}
