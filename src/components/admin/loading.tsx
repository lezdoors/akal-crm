import { Translate, useTimeout } from "ra-core";

/**
 * Loading indicator used for slow element or page loads.
 *
 * Displays a spinner and customizable loading messages.
 * Automatically shown by the default Layout when page loading takes more than 1 second.
 * Works as a fallback for React Suspense boundaries.
 *
 * @see {@link https://marmelab.com/shadcn-admin-kit/docs/loading/ Loading documentation}
 */
export const Loading = (props: LoadingProps) => {
  const {
    loadingPrimary = "ra.page.loading",
    loadingSecondary = "ra.message.loading",
    delay = 1000,
    ...rest
  } = props;
  const oneSecondHasPassed = useTimeout(delay);
  return oneSecondHasPassed ? (
    <div className="flex flex-col justify-center items-center h-full" {...rest}>
      <div className="text-center">
        <p className="overline">
          <Translate i18nKey={loadingPrimary}>{loadingPrimary}</Translate>
        </p>
        <p className="display mt-2 text-[19px] text-ink-soft">
          <Translate i18nKey={loadingSecondary}>{loadingSecondary}</Translate>
        </p>
      </div>
    </div>
  ) : null;
};

export interface LoadingProps {
  loadingPrimary?: string;
  loadingSecondary?: string;
  delay?: number;
}
