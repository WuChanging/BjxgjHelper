import { Link } from 'react-router-dom'
import './index.css';

const ErrorPage = () => (
  <div className="error-page blocks blocks-rosybrown margin-auto text-center">
    <div className='title large'>🥵 QwQ 🥵</div>
    <div className='title fir'>You seem to be lost,</div>
    <div className='title fir'>here may be a helpful link:</div>
    <Link to='/index' className="borders bg-blue">Home</Link>
  </div>
)

export default ErrorPage