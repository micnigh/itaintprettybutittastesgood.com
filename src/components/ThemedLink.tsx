import React from 'react'
import type { GatsbyLinkProps } from "gatsby";
import { Link as GatsbyLink } from "gatsby";
import type { FC } from "react";
import { forwardRef } from "react";
import type { LinkProps as ThemeLinkProps } from "theme-ui";
import { Link as ThemeLink } from "theme-ui";

type LinkProps = Omit<ThemeLinkProps, "as" | "href"> & AsLinkProps;
type AsLinkProps = Omit<GatsbyLinkProps<unknown>, "ref" | "activeClassName">;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  props,
  ref
) {
  return <ThemeLink ref={ref} variant="default" {...props} as={AsLink} />;
});

const AsLink: FC<AsLinkProps> = (props) => (
  <GatsbyLink activeClassName="active" {...props} />
);
