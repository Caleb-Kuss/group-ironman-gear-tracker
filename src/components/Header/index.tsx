import Link from "next/link";
import Join from "../../components/Join";
import { getServerSession } from "next-auth";
import { BASE_API_URL } from "@/utils/constants";

export default async function Header() {
  const session = await getServerSession();
  BASE_API_URL;
  const logOut = `${BASE_API_URL}/api/auth/signout?callbackUrl=/`;
  const logIn = `${BASE_API_URL}/api/auth/signin`;
  return (
    <>
      <header className="border-b border-yellow-400 bg-stone-600 px-4 py-3 text-white">
        <ul className="flex flex-nowrap justify-evenly items-center">
          <li className="mr-4 flex-grow">
            <Link href="/">Home</Link>
          </li>
          <li className="mr-4 flex-grow">
            <Link href="/clues">Clues</Link>
          </li>
          <li className="mr-4 flex-grow">
            <Link href="/gear">Gear</Link>
          </li>

          {session ? (
            <>
              <li className="mr-4 flex-grow ">
                <Join />
              </li>
              <li className="mr-4 flex-grow">
                <Link href={logOut}>Log Out </Link>
              </li>
              <li className="mr-4 flex-grow">
                <Link href="/me">Me</Link>
              </li>
            </>
          ) : (
            <Link className="mr-4 flex-grow" href={logIn}>
              {" "}
              Log In
            </Link>
          )}
        </ul>
      </header>
    </>
  );
}
