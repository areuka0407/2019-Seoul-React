import Layout from "../../components/Layout";
import { useRouter } from "next/router";

export default function Profile(){
    const router = useRouter();

    return (
        <Layout>
            <p>안녕하세요? 전 {router.query.profile}이에요!</p>
        </Layout>
    )
}
