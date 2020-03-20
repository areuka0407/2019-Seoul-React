import Header from "./Header";


const Layout = props => (
    <div>
        <Header />
        <div id="wrap">
            {props.children}
        </div>
    </div>
)

export default Layout;