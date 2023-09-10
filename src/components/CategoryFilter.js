// components/CategoryFilter.js
import Link from 'next/link';

const CategoryFilter = ({ categories, onSelectCategory }) => {
    return (
        <div>
            <h2>Categories</h2>
            <ul>
                {categories.map((category) => (
                    <li key={category}>
                        <Link href={`/category/${category}`}>
                            <a onClick={() => onSelectCategory(category)}>{category}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryFilter;
