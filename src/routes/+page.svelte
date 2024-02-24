<script lang="ts">
    import Item from '$lib/components/Item.svelte';

    const itemSize = {
        width: 50,
        height: 50
    }

    type Item = {
        id: number;
        x: number;
        y: number;
        hover: boolean;
        text: string;
    }

    let items: Item[] = [
        {id: 1, x: 0, y: 0, hover: false, text: 'Item 1'},
        {id: 2, x: 50, y: 0, hover: false, text: 'Item 2'},
        {id: 3, x: 10, y: 10, hover: false, text: 'Item 3'},
    ]

    let hoverId: number = -1;

    function checkForOverlap(currentItem: Item, currentX: number, currentY: number, combine: boolean) {
        let curIndex = items.findIndex(item => item.id === currentItem.id);
        const overlapIndex = items.findIndex((item, idx) => {
            if (idx === curIndex) return false; // Skip checking against itself
            // Check if the current div overlaps with div
            const horizontalOverlap = currentX < item.x + itemSize.width && currentX + itemSize.width > item.x;
            const verticalOverlap = currentY < item.y + itemSize.height && currentY + itemSize.height > item.y;
            return horizontalOverlap && verticalOverlap;
        });

        if (combine && overlapIndex !== -1) {
            console.log(`Item ${curIndex} overlaps with Div ${overlapIndex}`);
            combineItems(curIndex, overlapIndex);
        }
    }


    function combineItems(index1: number, index2: number) {
        let item1 = items[index1];
        let item2 = items[index2];

        item1.x = (item1.x + item2.x) / 2;
        item1.y = (item1.y + item2.y) / 2;
        item1.text = getNewText(item1.text, item2.text);
        items.splice(index2, 1);

        items = items;
    }

    function getNewText(text1: string, text2: string) {
        return text1 + ' ' + text2;
    }
</script>

{#each items as item (item.id)}
    <Item text={item.text} bind:x={item.x} bind:y={item.y}
          on:drop={(event) => checkForOverlap(item, event.detail.x, event.detail.y, true)}
    />
{/each}
