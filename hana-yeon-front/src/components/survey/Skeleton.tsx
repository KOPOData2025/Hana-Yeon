/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { NavigationBar, ListRow, ProgressBar, Spacing } from "tosslib";

const skeletonAnimation = css`
  background: linear-gradient(
    90deg,
    hsl(var(--muted)) 25%,
    hsl(var(--muted-foreground) / 0.1) 50%,
    hsl(var(--muted)) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export function LineSkeleton({
  width = "100%",
  height = 16,
}: {
  width?: string | number;
  height?: number;
}) {
  return (
    <div
      css={[
        skeletonAnimation,
        {
          width,
          height,
          borderRadius: 4,
        },
      ]}
    />
  );
}

export function ProgressBarSkeleton() {
  return (
    <>
      <NavigationBar
        left={
          <div
            css={[
              skeletonAnimation,
              {
                width: 24,
                height: 24,
                borderRadius: 4,
              },
            ]}
          />
        }
      />
      <div className="p-4 bg-muted">
        <ProgressBar
          progress={0}
          size="light"
          topAddon={
            <ProgressBar.Row>
              <LineSkeleton width={80} height={14} />
              <LineSkeleton width={60} height={14} />
            </ProgressBar.Row>
          }
        />
      </div>
    </>
  );
}

export function MultipleQuestionSkeleton() {
  return (
    <div css={{ padding: "0 24px" }}>
      <div css={{ marginBottom: 32 }}>
        <LineSkeleton width="85%" height={20} />
        <Spacing size={8} />
        <LineSkeleton width="60%" height={16} />
        <Spacing size={4} />
        <LineSkeleton width="40%" height={14} />
      </div>

      <div css={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {new Array(4).map((index) => (
          <ListRow
            key={index}
            left={
              <div
                css={[
                  skeletonAnimation,
                  {
                    width: 20,
                    height: 20,
                    borderRadius: 2,
                  },
                ]}
              />
            }
            contents={
              <LineSkeleton width={`${Math.random() * 30 + 60}%`} height={14} />
            }
          />
        ))}
      </div>
    </div>
  );
}

export const Skeleton = Object.assign(LineSkeleton, {
  ProgressBar: ProgressBarSkeleton,
  Question: MultipleQuestionSkeleton,
});
