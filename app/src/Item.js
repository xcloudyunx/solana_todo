function Item(props) {
    return (
        <div class="item">
            <input type="checkbox" onChange={props.complete} class="complete" />
            <label class="label">{props.value}</label>
            <input type="radio" onChange={props.remove} class="remove" />
        </div>
    );
}

export default Item;