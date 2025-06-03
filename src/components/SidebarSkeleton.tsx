import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
    title?: string;
}

export const SidebarSkeleton = ({ title }: Props) => (
    <div style={{ padding: 10 }}>
        <h3 style={{ margin: "0 15px 10px" }}>{title || ""}</h3>
        {[...Array(20)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <Skeleton height={20} width={200} />
            </div>
        ))}
    </div>
);
