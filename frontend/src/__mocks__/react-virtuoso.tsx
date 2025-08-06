// src/__mocks__/react-virtuoso.tsx

/** ✅ Правильный мок: export default */
const GroupedVirtuoso = ({ groupCounts, groupContent, itemContent }: any) => {
    const items = [];
    let itemIndex = 0;

    for (let groupIndex = 0; groupIndex < groupCounts.length; groupIndex++) {
        // Группа
        items.push(
            <div key={`group-${groupIndex}`} data-testid="virtuoso-group">
                {groupContent(groupIndex)}
            </div>
        );

        // Элементы
        for (let i = 0; i < groupCounts[groupIndex]; i++) {
            items.push(
                <div key={`item-${itemIndex}`} data-testid="virtuoso-item">
                    {itemContent(itemIndex++)}
                </div>
            );
        }
    }

    return <div data-testid="mocked-virtuoso">{items}</div>;
};

export default GroupedVirtuoso;
