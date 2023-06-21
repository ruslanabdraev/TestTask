import React, { Component } from 'react';
import authService from "./api-authorization/AuthorizeService";

export class Home extends Component {
  static displayName = Home.name;

  /*
  * 
  * {
    "id": "84f53fe8-4fb9-42bc-b036-178801832171",
    "userName": "test@test.test",
    "normalizedUserName": "TEST@TEST.TEST",
    "email": "test@test.test",
    "normalizedEmail": "TEST@TEST.TEST",
    "emailConfirmed": true,
    "passwordHash": "AQAAAAEAACcQAAAAEK95ZKMO1wRY10xLJyWLy8RiH/4u4YTqyBcPp32moyh8fyaIrkDykYReu4p47gnR+Q==",
    "securityStamp": "HPLIBIRZDFEUXM3VUVKBCWCUNTLSGPYS",
    "concurrencyStamp": "04cfb884-f809-4528-8c2f-9a8231f27d80",
    "phoneNumber": null,
    "phoneNumberConfirmed": false,
    "twoFactorEnabled": false,
    "lockoutEnd": null,
    "lockoutEnabled": true,
    "accessFailedCount": 0
  }
  * */
    
    constructor() {
        super();
        this.state = { currentUser: null, isAuthenticated: false, users: [], loading: true };
    }
  
    componentDidMount() {
        this.populateUsersData();
    }

    static deleteUser = async (id) => {
        console.log(id);
        const token = await authService.getAccessToken();
        const response = await fetch('user/' + id, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
            method: 'DELETE',
        });
        
        
    }
    
    static renderUsersTable(users){
        
        return (
            <div>
                <h2 id="tabelLabel" >Users</h2>
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user =>
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => this.deleteUser(user.id)}>delete</button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        );
    }

  render () {
      let contents = this.state.loading 
          ? <p><em>Loading...</em></p>
          :  Home.renderUsersTable(this.state.users);

      return (
      <div>
        <h1>Hello, world!</h1>
        <p>Welcome to your new single-page application, built with:</p>
        <ul>
          <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
          <li><a href='https://facebook.github.io/react/'>React</a> for client-side code</li>
          <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
        </ul>
        <p>To help you get started, we have also set up:</p>
        <ul>
          <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
          <li><strong>Development server integration</strong>. In development mode, the development server from <code>create-react-app</code> runs in the background automatically, so your client-side resources are dynamically built on demand and the page refreshes when you modify any file.</li>
          <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and your <code>dotnet publish</code> configuration produces minified, efficiently bundled JavaScript files.</li>
        </ul>
        <p>The <code>ClientApp</code> subdirectory is a standard React application based on the <code>create-react-app</code> template. If you open a command prompt in that directory, you can run <code>npm</code> commands such as <code>npm test</code> or <code>npm install</code>.</p>
          {this.state.isAuthenticated && contents}
      </div>
    );
  }

  async populateUsersData(){
      const flag = await authService.isAuthenticated();
      
      if(flag) {
          const user = await authService.getUser();
          const token = await authService.getAccessToken();
          const response = await fetch('user', {
              headers: !token ? {} : {'Authorization': `Bearer ${token}`}
          });
          const data = await response.json();
          this.setState({ currentUser: user, isAuthenticated: flag, users: data, loading: false});
      }else{
          this.setState({ currentUser: null, isAuthenticated: flag, users: [], loading: false});
      }
  }
}
