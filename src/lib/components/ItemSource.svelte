<script lang="ts">
    export let text: string;
    const titleCase = (str: string) => {
        if (!str) return "";
        return str.toLowerCase().split(' ').map(function (word) {
            // Check if the word is 'it', if so, return 'IT'
            if (word === "it") {
                return "IT";
            } else {
                return word.replace(word[0], word[0].toUpperCase());
            }
        }).join(' ');
    };

    text=titleCase(text);
</script>

<div class="career-item">
    <h1 class="career-item-text select-none">{titleCase(text)}</h1>
</div>

<style>
    .career-item {
        background: #8696FE;
        border-radius: 5px;
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.3s background-color;
    }

    .career-item:hover {
        background: #4942E4;
        transition: 0.3s background-color;
        cursor: grab;
    }

    .career-item-text {
        color: #faf6ed;
        font-family: Kumbh Sans, sans-serif;
        text-align: center;
    }
</style>