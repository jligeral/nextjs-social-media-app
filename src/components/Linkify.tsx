import {LinkIt, LinkItUrl} from "react-linkify-it";
import Link from "next/link";
import UserLinkWithTooltip from "@/components/UserLinkWithTooltip";

interface LinkifyProps {
  children: React.ReactNode;
}

export default function Linkify({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );

}

function LinkifyUrl({ children }: LinkifyProps) {
 return (
   <LinkItUrl className={`text-primary hover:underline`}>{children}</LinkItUrl>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return <LinkIt
    component={(match, key) => (
      <UserLinkWithTooltip
        username={match.slice(1)}
        key={key}
      >
        {match}
      </UserLinkWithTooltip>

    )}
    regex={/(@[a-zA-Z0-9_-]+)/}
  >
    {children}
  </LinkIt>

}

function LinkifyHashtag({ children }: LinkifyProps) {
  return <LinkIt
    component={(match, key) => (
      <Link
        href={`/hashtag/${match.slice(1)}`}
        key={key}
        className={`text-primary hover:underline`}
      >
        {match}
      </Link>
      )}
    regex={/(#[a-zA-Z0-9-]+)/}
  >
    {children}
  </LinkIt>
}
