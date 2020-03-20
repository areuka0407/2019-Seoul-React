import Layout from "../components/Layout";
import Link from "next/link";

const ProfileLink = props => (
    <div>
        <Link href={"/p/[profile]"} as={`/p/${props.profile}`}>
            <a>{props.profile}의 프로필</a>
        </Link>
    </div>
)


const Index = () => {
    let friendList = ["김민재", "황성철", "연지수", "조예진"];

    let listElem = friendList.map(x => (<ProfileLink profile={x}/>));

    return (
        <Layout>
            <h1>친구 목록</h1>
            {listElem}
        </Layout>
    )
}

export default Index;