import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SidebarSkeleton = () => (
    <div style={{ padding: 10 }}>
        <h3>Организации</h3>
        {[...Array(20)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <Skeleton height={20} width={200} />
            </div>
        ))}
    </div>
);
