import React from 'react';
import ReactDOM from 'react-dom';
import style from './style.css';


export default class App extends React.Component {
    render() {
      return (
        <div >
          <div >    
            <p className={style.red}>
              This should be red
            </p>
            <p className={style.test}>
              This should not display
            </p>                
          </div>
        </div>
      );
    }
}

ReactDOM.render(
    <App />,
  document.getElementById('app'));

