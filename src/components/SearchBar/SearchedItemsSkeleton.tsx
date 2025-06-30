import {
    CustomDatalistItem,
    CustomDatalistItemHeader,
    CustomDatalistItemText,
} from "./StyledComponents";
import { CustomSkeleton } from "../StyledComponents";

export const SearchedItemsSkeleton = () => (
    <>
        {[...Array(10)].map((_, i) => (
            <CustomDatalistItem key={i}>
                <CustomDatalistItemHeader>
                    <CustomSkeleton height={10} width={100} />
                </CustomDatalistItemHeader>
                <CustomDatalistItemText>
                    <CustomSkeleton
                        style={{ marginTop: "10px" }}
                        height={10}
                        width={50}
                    />
                </CustomDatalistItemText>
            </CustomDatalistItem>
        ))}
    </>
);
