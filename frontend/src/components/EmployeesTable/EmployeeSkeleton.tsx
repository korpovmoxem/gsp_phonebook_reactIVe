import { CustomSkeleton } from "../StyledComponents";

export const EmployeeSkeleton = () => (
    <div style={{ padding: 10 }}>
        {[...Array(9)].map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <CustomSkeleton height={60} />
            </div>
        ))}
    </div>
);
