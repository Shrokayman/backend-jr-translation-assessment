// models/translation.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { User } from './User.js';

const Translation = sequelize.define('Translation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        foreignKey: true,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    translations: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
    },
    sourceLang: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    targetLang: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    engine: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { timestamps: true });

Translation.associate = (models) => {
    Translation.belongsTo(models.User, {
        foreignKey: 'userId',
        allowNull: false,
        as: 'user',
    });
};
Translation.sync()
export { Translation }