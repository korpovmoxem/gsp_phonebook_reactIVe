import Skeleton from "react-loading-skeleton";

export const EmployeeSkeleton = () => (
    <div style={{ padding: 10 }}>
        {[...Array(6)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <Skeleton height={100} />
            </div>
        ))}
    </div>
);
