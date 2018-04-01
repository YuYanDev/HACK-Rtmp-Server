// require('es5-shim');
// require('es5-shim/es5-sham');
// require('console-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import "isomorphic-fetch";
import "babel-polyfill";
import './compoment/bulma.min.css';
import './compoment/github-markdown.css';



/**
 * 一言
 */
class Hitokoto extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      hitokotoText: '',
      hitokotoCatName: ''
    };
  }
  componentDidMount() {
    async function fetchAsyncPageMarkdown () {
      let response = await fetch(`/api/hitokoto/`);
      
      let data = await response.json();
      return data;
    }
    
    fetchAsyncPageMarkdown()
    .then(data => {
      this.setState({
        hitokotoText: data.hitokoto,
        hitokotoCatName: data.catname
        });
      }
    )
    .catch(function (reason) {
      return console.log(reason.message);
    });

  }

  render() {
    return (
      <div>
        <h1>
        一言: 
        {this.state.hitokotoText}
        </h1>
        <h5>{this.state.hitokotoCatName}</h5>
      </div>
    );
  }
}


/**
 * 首屏渲染
 */
class IndexPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false,
      blilibiliBangumi:''
    };
  }
  componentDidMount() {
    async function fetchAsyncloginStatus () {
      let response = await fetch(`/auth/islogin`,{credentials: 'include'});
      
      let data = await response.json();
      return data;
    }
    
    fetchAsyncloginStatus()
    .then(data => {
      this.setState({
        loginStatus: data.ret_login_status
        });
      }
    )
    .catch(function (reason) {
      return console.log(reason.message);
    });
  }
  
  render(){
    return(
      <div>
      <section className="hero is-primary">
        
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <a className="navbar-item">
                  首页
                </a>
                <a className="navbar-item">
                  文章
                </a>
                <span className="navbar-burger burger" data-target="navbarMenuHeroA">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
              <div id="navbarMenuHeroA" className="navbar-menu">
                <div className="navbar-end">
                  <span className="navbar-item">
                  {this.state.loginStatus ? (
                      <a className="button is-primary is-inverted" href="/admin">
                      <span className="icon">
                      <i className="fa fa-terminal" aria-hidden="true"></i>
                      </span>
                      <span>控制台</span>
                      </a>
                    ) : (
                      <a className="button is-primary is-inverted" href="/auth/login">
                      <span className="icon">
                      <i className="fa fa-sign-in" aria-hidden="true"></i>
                      </span>
                      <span>登录</span>
                      </a>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      
        
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              宅日记
            </h1>
          </div>
        </div>
      
       
        <div className="hero-foot">
          <nav className="tabs">
            <div className="container">
              <ul>
                <li className="is-active"><a>动漫</a></li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
      
      <section className="section is-medium">
          <div className="container">
            <div >
              
                { Object.entries(this.state.blilibiliBangumi).map(function(item,index){
                  var items = JSON.parse(JSON.stringify(item.slice(1)).substring(1,JSON.stringify(item.slice(1)).length-1));
                  return(
                    <div key={index}>
                    </div>
                  )
                })}
              
            </div>
          </div>
        </section>
    
      
    
    
    
      </div>
    )
  }
}



  ReactDOM.render(<IndexPage/>, document.getElementById('app'));
